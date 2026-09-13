export function getSmsConfig() {
  const accountSid = process.env.TWILIO_ACCOUNT_SID
  const authToken = process.env.TWILIO_AUTH_TOKEN
  const from = process.env.TWILIO_SMS_FROM
  if (!accountSid || !authToken || !from) return null
  return { accountSid, authToken, from }
}
