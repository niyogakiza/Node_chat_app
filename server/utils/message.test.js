const expect = require('expect');
const {generateMessage} = require('./message');


describe('generateMessage', () =>{
    it('should generate correct message object', () =>{

        let from = 'Jon';
        let text = 'Some Messages';
        let message = generateMessage(from, text);

        expect(typeof message.createdAt).toBe('number');
        //expect(message).toInclude({from, text});


    });
});