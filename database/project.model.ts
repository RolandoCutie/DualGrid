import mongoose, { Document, Schema } from 'mongoose';

export interface IProjectDoc extends Document {
  name: string;
  slug: string;
  description: string;
  technologies: string[];
  images: string[]; // Cloudinary URLs
  link?: string;
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProjectDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    description: { type: String, required: true, trim: true },
    technologies: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    link: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const Project = mongoose.models.Project || mongoose.model<IProjectDoc>('Project', ProjectSchema);

export default Project;
