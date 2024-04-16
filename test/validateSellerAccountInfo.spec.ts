import ValidateSellerAccountInfo from '../src/services/validateSellerAccountInfo';


describe('Test of validate seller infos', () => {
  
  const validateInfos = new ValidateSellerAccountInfo()
  
  it('should return true in validate email', () => {
    const validate = validateInfos.validateEmail('teste@example.com')
    
    expect(validate).toBeTruthy()
  })
  
  it('should return false in validate email', () => {
    const validate = validateInfos.validateEmail('Teste@example.com')
    
    expect(validate).toBeFalsy()
  })
  
  it('should return true in validate phone number', () => {
    const validate = validateInfos.validatePhone('+5512345678910')
    
    expect(validate).toBeTruthy()
  })
  
  it('should return false in validate phone number', () => {
    const validate = validateInfos.validatePhone('5512345678910')
    
    expect(validate).toBeFalsy()
  })
  
  it('should infos are valide', () => {
    const validate = validateInfos.validateInfoAboutStore('Company','This a big company', 'electronics',true)
    
    expect(validate).toBeUndefined()
  })
  
  it('should return error when name is not add', () => {
    const validate = validateInfos.validateInfoAboutStore('','This a big company', 'electronics',true)
    
    expect(validate).toBe('Error name and status infos are required')
  })
  
  it('should return error when status is not add', () => {
    const validate = validateInfos.validateInfoAboutStore('company','This a big company', 'electronics','')
    
    expect(validate).toBe('Error name and status infos are required')
  })
  
  it('should return error in validate of length name', () => {
    const validate = validateInfos.validateInfoAboutStore('Lorem ipsum dolor sit amet, consectetur adipiscing elit','This a big company', 'electronics',true)
    
    expect(validate).toMatch(/name/)
  })
  
  it('should return error in validate of length description', () => {
    const validate = validateInfos.validateInfoAboutStore('Company','Lorem ipsum dolor sit amet. Et neque optio vel ipsam nisi non maxime modi est eaque consequatur! Et dolorem error cum accusantium praesentium ea doloribus voluptatem sed voluptates rerum et sunt iure ut molestiae placeat? Eos rerum internos cum iusto ducimus eum incidunt quibusdam. Ad tenetur sunt ut dignissimos galisum vel aliquam laboriosam et tempora facilis ea animi dicta. 33 repellat velit sit adipisci quia a cumque enim qui porro nisi? Aut voluptas voluptas ea harum expedita aut tenetur quia sed ipsam voluptatem rem assumenda voluptatum. Sed optio architecto sed dolores alias aut reiciendis dolores qui molestiae omnis in odio illo non iste voluptatum. Eum eius dolor nam impedit reprehenderit ea autem veritatis aut fugit exercitationem ut reprehenderit quae et vero error! Est adipisci sequi et cupiditate consequatur id soluta laudantium.', 'electronics',true)
    
    expect(validate).toMatch(/description/)
  })
  
  it('should return error in validate of length category', () => {
    const validate = validateInfos.validateInfoAboutStore('company','This a big company', 'Lorem ipsum dolor sit amet. Et neque optio vel ipsam nisi non maxime modi est eaque consequatur! Et dolorem error cum accusantium',true)
    
    expect(validate).toMatch(/category/)
  })
  
  it('should return error in validate of status', () => {
    const validate = validateInfos.validateInfoAboutStore('Company','This a big company', 'electronics','true')
    
    expect(validate).toBe('The status property must be of boolean type, true or false')
  })
})