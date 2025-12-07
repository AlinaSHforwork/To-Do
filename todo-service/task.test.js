import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import Task from './models/Task.js';

let mongoServer;

// 1. Before tests run, connect to the Fake DB
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
});

// 2. After tests are done, disconnect and clean up
afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe('Task Model Test', () => {

    // TEST 1
    it('should save a task successfully', async () => {
        const validTask = new Task({
            text: 'Learn Testing',
            userId: 'user123'
        });
        const savedTask = await validTask.save();
        
        expect(savedTask._id).toBeDefined();
        expect(savedTask.text).toBe('Learn Testing');
    });

    // TEST 2
    it('should fail if "text" field is missing', async () => {
        const invalidTask = new Task({
            userId: 'user123'
            // We intentionally forgot "text"
        });

        let err;
        try {
            await invalidTask.save();
        } catch (error) {
            err = error;
        }

        // We expect an error to have happened
        expect(err).toBeDefined();
        expect(err.errors.text).toBeDefined(); // It should complain about "text"
    });
});