/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use strict';
import { Model } from 'sequelize';
import { IContact } from '../interfaces/contact.interface';

export default (sequelize, DataTypes) => {
  class Contact extends Model<IContact> implements IContact {
    public email?: string;
    public id: string | number;
    public phoneNumber?: string;
    public linkedId?: string | number;
    public linkPrecedence: string;
    public createdAt: Date;
    public updatedAt: Date;
    public deletedAt?: Date;
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Contact.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      email: DataTypes.STRING,
      phoneNumber: { type: DataTypes.STRING, allowNull: true, defaultValue: null },
      linkedId: { type: DataTypes.INTEGER, allowNull: true, defaultValue: null },
      linkPrecedence: {
        type: DataTypes.ENUM({
           values: ['primary', 'secondary']
        }),
        defaultValue: "primary"
      },
      createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },              
      updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },              
      deletedAt: { type: DataTypes.DATE, allowNull: true, defaultValue: null }
    },  
    {
      sequelize,
      modelName: 'contacts'
    }
  );
  return Contact;
};
