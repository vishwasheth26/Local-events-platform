const { sequelize } = require('./src/models');
const models = require('./src/models');

async function checkModels() {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    
    console.log('Loaded models:', Object.keys(models));
    
    if (models.Event) {
        console.log('Event associations:', Object.keys(models.Event.associations));
        const attendeesAssoc = models.Event.associations.attendees;
        if (attendeesAssoc) {
            console.log('Event.attendees through model:', attendeesAssoc.through.model.name);
        }
    }
    
    if (models.User) {
        console.log('User associations:', Object.keys(models.User.associations));
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await sequelize.close();
  }
}

checkModels();
