import SendSms from '../src/services/sendSms';

it('should send sms', async () => {
  const sms = new SendSms('Test of send','')
  const send = await sms.execute()
  
  expect(send.errorMessage).toBe(null)
})