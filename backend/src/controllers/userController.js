const { User, Event, Group, RSVP, GroupMember } = require('../models');

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['passwordHash'] },
      include: [
        { model: Event, as: 'organizedEvents' },
        { model: Group, as: 'organizedGroups' }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    if (parseInt(req.params.id) !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const { name, phone, location, interests, certifications, linkedInConnected } = req.body;

    await user.update({
      name,
      phone,
      location,
      interests,
      certifications,
      linkedInConnected
    });

    res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: user.location,
        interests: user.interests,
        certifications: user.certifications,
        linkedInConnected: user.linkedInConnected,
        role: user.role
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserEvents = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Event, as: 'organizedEvents' },
        { model: Event, as: 'attendedEvents', through: { attributes: ['status'] } }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      organized: user.organizedEvents,
      attending: user.attendedEvents
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserGroups = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      include: [
        { model: Group, as: 'organizedGroups' },
        { model: Group, as: 'joinedGroups', through: { attributes: ['role'] } }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      organized: user.organizedGroups,
      joined: user.joinedGroups
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
