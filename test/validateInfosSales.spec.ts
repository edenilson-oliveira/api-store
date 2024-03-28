import ValidateInfos from '../src/services/validateInfosSales';


describe('Test of validate infos sales', () => {
  it('should infos are valide', () => {
    const validateInfos = new ValidateInfos('Company','This a big company', 'electronics',true).execute()
    
    expect(validateInfos).toBe(true)
  })
  it('should return error in validate', () => {
    const validateInfos = new ValidateInfos('Lorem ipsum dolor sit amet, consectetur adipiscing elit','This a big company', 'electronics',true).execute()
    
    expect(typeof validateInfos.message).toBe('string')
  })
})