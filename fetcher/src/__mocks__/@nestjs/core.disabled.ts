export const _createMicroservice = jest.fn().mockImplementation( () => Promise.resolve({
        listen: jest.fn()
}));

export const NestFactory = {
        createMicroservice:_createMicroservice
    }