import sequelize, { DataTypes } from '../config/database';
const { Op, Sequelize } = require("sequelize");
import contact from '../models/contact';

class ContactService {
  private Contact = contact(sequelize, DataTypes);

  //create/update contacts linked to same person
  public linkContact = async (body) => {
    try {
      let { email = null, phoneNumber = null } = body;

      const linkedContact = {
        primaryContactId: null, emails: [], 
          phoneNumbers: [], secondaryContactIds: []
      }

      if(!email && !phoneNumber) {
        return linkedContact;
      }

      const emailQuery = email ? `"contacts"."email"='${email}'` : "";
      const phoneNumberQuery = phoneNumber ? `"contacts"."phoneNumber"='${phoneNumber}'` : "";
      let contactQuery = emailQuery;
      if(phoneNumberQuery) {
        contactQuery += (contactQuery ? " or " + phoneNumberQuery : phoneNumberQuery)
      }


      const contactSearch  = `(select id from contacts  where "contacts"."deletedAt" is null and  (${contactQuery}) )`
      
      const parentContactSearch  = `(select "contacts"."linkedId" from contacts  where "contacts"."deletedAt" is null and  (${contactQuery}) )`
      
      let allContacts = await this.Contact.findAll({
        where: {
          deletedAt: null,
          [Op.or]: [
            { id: { [Op.in]: Sequelize.literal(contactSearch) } },
            { id: { [Op.in]: Sequelize.literal(parentContactSearch) } },
            { linkedId: { [Op.in]: Sequelize.literal(parentContactSearch) } },
            { linkedId: { [Op.in]: Sequelize.literal(contactSearch) } }
          ]
        },
        order: [
          ['id', 'ASC']
        ]
      });

      let primaryContactId = null, secondaryContactIds = [], emails = [], phoneNumbers = [],
      // checking if given email and phoneNumber already added
      phoneNumberAdded = phoneNumber ? false : true, emailAdded = email ? false : true;

      
      for(let ind = 0; ind<allContacts.length; ind++) {
          const currContact = allContacts[ind];
          
          phoneNumberAdded = !phoneNumberAdded ? currContact.phoneNumber == phoneNumber : phoneNumberAdded;
          emailAdded = !emailAdded ? currContact.email == email : emailAdded; 
    
          if(!primaryContactId) {
              primaryContactId = currContact.linkedId ? currContact.linkedId : currContact.id;
          } else {
            secondaryContactIds.push(currContact.id);
          }
          if(currContact.email) {
            emails.push(currContact.email);
          }
          if(currContact.phoneNumber) {
            phoneNumbers.push(currContact.phoneNumber);
          }
      }

      if(!emailAdded || !phoneNumberAdded) {
          const newContact = await this.Contact.create(
          { email, phoneNumber, linkPrecedence: primaryContactId ? "secondary": "primary",
            linkedId : primaryContactId
          }
          );

          primaryContactId = primaryContactId ? primaryContactId : newContact.id;
          if(email) {
            emails.push(email);
          }
          if(phoneNumber) {
            phoneNumbers.push(phoneNumber);
          }
          if(primaryContactId != newContact.id) {
            secondaryContactIds.push(newContact.id);
          }
      }

      if(secondaryContactIds.length) {
        await this.Contact.update(
          { linkPrecedence: "secondary", linkedId: primaryContactId, updatedAt: new Date() },
          { where: {
            [Op.or] : [
              { id: secondaryContactIds },
              { linkedId: secondaryContactIds }
            ]
          }

          }
        )
      }

      linkedContact["primaryContactId"] = primaryContactId;
      linkedContact["emails"] = [...new Set(emails)];
      linkedContact["phoneNumbers"] = [...new Set(phoneNumbers)];
      linkedContact["secondaryContactIds"] = [...new Set(secondaryContactIds)];

      return linkedContact;
    } catch(error) {
      console.log("Error in linking contacts", error)
      throw error;
    }
  };
}

export default ContactService;
