const { Group, User, GroupMember } = require('../models');
const { Op } = require('sequelize');

exports.createGroup = async (req, res) => {
  try {
    const { name, description, category, location, image } = req.body;
    const organizerId = req.user.id;

    const group = await Group.create({
      name,
      description,
      category,
      location,
      image,
      organizerId
    });

    // Add organizer as admin member
    await GroupMember.create({
      userId: organizerId,
      groupId: group.id,
      memberRole: 'admin'
    });

    res.status(201).json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.getGroups = async (req, res) => {
  try {
    const { page = 1, limit = 10, category, search } = req.query;
    const offset = (page - 1) * limit;
    const where = {};

    if (category) where.category = category;
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const groups = await Group.findAndCountAll({
      where,
      limit,
      offset,
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id'], through: { attributes: [] } }
      ],
      distinct: true,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      groups: groups.rows,
      totalPages: Math.ceil(groups.count / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getGroupById = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id, {
      include: [
        { model: User, as: 'organizer', attributes: ['id', 'name', 'email'] },
        { model: User, as: 'members', attributes: ['id', 'name'], through: { attributes: ['memberRole'] } }
      ]
    });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.joinGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.id;

    const group = await Group.findByPk(groupId);
    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const existingMember = await GroupMember.findOne({ where: { userId, groupId } });
    if (existingMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    const member = await GroupMember.create({
      userId,
      groupId,
      role: 'member'
    });

    res.status(201).json(member);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.leaveGroup = async (req, res) => {
  try {
    const userId = req.user.id;
    const groupId = req.params.id;

    const member = await GroupMember.findOne({ where: { userId, groupId } });
    if (!member) {
      return res.status(400).json({ message: 'Not a member' });
    }

    // Prevent organizer from leaving (or handle ownership transfer logic later)
    const group = await Group.findByPk(groupId);
    if (group.organizerId === userId) {
        return res.status(400).json({ message: 'Organizer cannot leave the group. Delete the group instead.' });
    }

    await member.destroy();
    res.json({ message: 'Left group successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await group.update(req.body);
    res.json(group);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteGroup = async (req, res) => {
  try {
    const group = await Group.findByPk(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    if (group.organizerId !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await group.destroy();
    res.json({ message: 'Group deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
