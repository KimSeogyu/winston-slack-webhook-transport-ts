import {jest} from '@jest/globals'

export default {
    create: jest.fn(() => {
        return {
            post: jest.fn(() => Promise.resolve({data: {}}))
        }
    })
}