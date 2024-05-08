import ValidateInfoAboutProduct from '../src/services/validateInfoAboutProduct';

describe('Test validate info about product', () => {
  it('should return undefined in verify exist values', () => {
    const validateInfoProduct = new ValidateInfoAboutProduct()
    const validate = validateInfoProduct.validateAllInfo('cell phone','500','10','0','Portable and fast')
    
    expect(validate).toBeUndefined()
  })
  
  it('should return message of error in verify name exist', () => {
    const validateInfoProduct = new ValidateInfoAboutProduct()
    const validate = validateInfoProduct.validateAllInfo('','500','10','0','Portable and fast')
    
    expect(validate).toMatch(/name/)
  })
  
  it('should return message of error in verify length of name', () => {
    const validateInfoProduct = new ValidateInfoAboutProduct()
    const validate = validateInfoProduct.validateAllInfo('Lorem ipsum dolor sit amet. Et neque optio vel ipsam nisi non maxime modi est eaque consequatur! Et dolorem error cum accusantium praesentium ea doloribus voluptatem sed voluptates rerum et sunt iure ut molestiae placeat? Eos rerum internos cum iusto ducimus eum incidunt quibusdam. Ad tenetur sunt ut dignissimos galisum vel aliquam laboriosam et tempora facilis ea animi dicta. 33 repellat velit sit adipisci quia a cumque enim qui porro nisi? Aut voluptas voluptas ea harum expedita aut tenetur quia sed','500','10','0','Portable and fast')
    
    expect(validate).toMatch(/name/)
  })
  
  it('should return error in verify number', () => {
    const validateInfoProduct = new ValidateInfoAboutProduct()
    const validate = validateInfoProduct.validateAllInfo('cell phone','500','10','i','Portable and fast')
    
    expect(validate).toMatch(/number/)
  })
  
})