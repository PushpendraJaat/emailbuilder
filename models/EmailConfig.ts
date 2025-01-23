import mongoose, { Schema, Document } from 'mongoose';

// Define the EmailConfig interface for TypeScript type checking
export interface IEmailConfig extends Document {
  title: string;
  content: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Define the schema for the email configuration data
const EmailConfigSchema: Schema = new Schema<IEmailConfig>(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      validate: {
        validator: function (v: string) {
          return /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)$/i.test(v);
        },
        message: (props: { value: string }) =>
          `'${props.value}' is not a valid image URL`,
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Create or retrieve the EmailConfig model
const EmailConfig =
  mongoose.models.EmailConfig ||
  mongoose.model<IEmailConfig>('EmailConfig', EmailConfigSchema);

export default EmailConfig;
