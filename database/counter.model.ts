/**
 * Atomic counter for auto-incrementing sequences.
 * Use Counter.findOneAndUpdate with $inc to avoid race conditions.
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface ICounterDoc extends Document {
  name: string;
  seq: number;
}

const CounterSchema = new Schema<ICounterDoc>({
  name: { type: String, required: true, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter =
  mongoose.models.Counter ||
  mongoose.model<ICounterDoc>('Counter', CounterSchema, 'dualgrid_counters');

export default Counter;

/**
 * Atomically increments the named counter and returns the new value.
 * Creates the counter document if it doesn't exist yet (upsert).
 */
export async function nextSeq(name: string): Promise<number> {
  const doc = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true },
  ).lean();
  return (doc as ICounterDoc).seq;
}
