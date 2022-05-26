const Validator = require('../Validator');
const expect = require('chai').expect;

describe('testing-configuration-logging/unit-tests', () => {
  describe('Validator', () => {
    it('валидатор проверяет строковые поля', () => {
      const validator = new Validator({
        name: {
          type: 'string',
          min: 10,
          max: 20,
        },
      });

      const tooShortErrors = validator.validate({name: 'Lalala'});
      const tooLongErrors = validator.validate({name: 'Lalalalalalalalalalala'});

      expect(tooShortErrors).to.have.length(1);
      expect(tooShortErrors[0]).to.have.property('field').and.to.be.equal('name');
      expect(tooShortErrors[0]).to.have.property('error').and.to.be.equal('too short, expect 10, got 6');

      expect(tooLongErrors).to.have.length(1);
      expect(tooLongErrors[0]).to.have.property('field').and.to.be.equal('name');
      expect(tooLongErrors[0]).to.have.property('error').and.to.be.equal('too long, expect 20, got 22');
    });

    it('валидатор проверяет числовые поля', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const tooLittleAgeErrors = validator.validate({age: 5});
      const tooBigAgeErrors = validator.validate({age: 22});

      expect(tooLittleAgeErrors).to.have.length(1);
      expect(tooLittleAgeErrors[0]).to.have.property('field').and.to.be.equal('age');
      expect(tooLittleAgeErrors[0]).to.have.property('error').and.to.be.equal('too little, expect 10, got 5');

      expect(tooBigAgeErrors).to.have.length(1);
      expect(tooBigAgeErrors[0]).to.have.property('field').and.to.be.equal('age');
      expect(tooBigAgeErrors[0]).to.have.property('error').and.to.be.equal('too big, expect 10, got 22');
    });

    it('валидатор проверяет соответствие типа', () => {
      const validator = new Validator({
        age: {
          type: 'number',
          min: 10,
          max: 20,
        },
      });

      const typeErrors = validator.validate({age: 'Lalala'});

      expect(typeErrors).to.have.length(1);
      expect(typeErrors[0]).to.have.property('field').and.to.be.equal('age');
      expect(typeErrors[0]).to.have.property('error').and.to.be.equal('expect number, got string');
    });

    // it('валидатор проверяет присутствие правила', () => {
    //   const validator = new Validator({});
    //
    //   const errors = validator.validate({name: 'Lalala'});
    //
    //   console.log(errors)
    //
    //   expect(errors).to.have.length(1);
    //   expect(errors[0]).to.have.property('field').and.to.be.equal('name');
    //   expect(errors[0]).to.have.property('error').and.to.be.equal('rules for field name not found');
    // });
  });
});
