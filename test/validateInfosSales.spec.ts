import ValidateSellerAccountInfo from '../src/services/validateSellerAccountInfo';


describe('Test of validate infos sales', () => {
  it('should infos are valide', () => {
    const validateInfos = new ValidateSellerAccountInfo('Company','This a big company', 'electronics',true).execute()
    
    expect(validateInfos).toBe(true)
  })
  
  it('should return error when name is not add', () => {
    const validateInfos = new ValidateSellerAccountInfo('','This a big company', 'electronics',true).execute()
    
    expect(validateInfos.message).toBe('Error name and status infos are required')
  })
  
  it('should return error when status is not add', () => {
    const validateInfos = new ValidateSellerAccountInfo('company','This a big company', 'electronics','').execute()
    
    expect(validateInfos.message).toBe('Error name and status infos are required')
  })
  
  it('should return error in validate of length name', () => {
    const validateInfos = new ValidateSellerAccountInfo('Lorem ipsum dolor sit amet, consectetur adipiscing elit','This a big company', 'electronics',true).execute()
    
    expect(validateInfos.message).toMatch(/name/)
  })
  
  it('should return error in validate of length description', () => {
    const validateInfos = new ValidateSellerAccountInfo('Company','Lorem ipsum dolor sit amet. Et neque optio vel ipsam nisi non maxime modi est eaque consequatur! Et dolorem error cum accusantium praesentium ea doloribus voluptatem sed voluptates rerum et sunt iure ut molestiae placeat? Eos rerum internos cum iusto ducimus eum incidunt quibusdam. Ad tenetur sunt ut dignissimos galisum vel aliquam laboriosam et tempora facilis ea animi dicta. 33 repellat velit sit adipisci quia a cumque enim qui porro nisi? Aut voluptas voluptas ea harum expedita aut tenetur quia sed ipsam voluptatem rem assumenda voluptatum. Sed optio architecto sed dolores alias aut reiciendis dolores qui molestiae omnis in odio illo non iste voluptatum. Eum eius dolor nam impedit reprehenderit ea autem veritatis aut fugit exercitationem ut reprehenderit quae et vero error! Est adipisci sequi et cupiditate consequatur id soluta laudantium.', 'electronics',true).execute()
    
    expect(validateInfos.message).toMatch(/description/)
  })
  
  it('should return error in validate of length category', () => {
    const validateInfos = new ValidateSellerAccountInfo('company','This a big company', 'Lorem ipsum dolor sit amet. Et neque optio vel ipsam nisi non maxime modi est eaque consequatur! Et dolorem error cum accusantium',true).execute()
    
    expect(validateInfos.message).toMatch(/category/)
  })
  
  it('should return error in validate of status', () => {
    const validateInfos = new ValidateSellerAccountInfo('Company','This a big company', 'electronics','true').execute()
    
    expect(validateInfos.message).toBe('The status property must be of boolean type')
  })
})