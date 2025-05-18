
// Mock notification system (would be replaced with actual SMS/notification service)

interface NotificationParams {
  to: string;
  message: string;
  type: "SMS" | "EMAIL" | "PUSH";
}

export async function sendNotification(params: NotificationParams): Promise<boolean> {
  console.log(`NOTIFICATION ${params.type} to ${params.to}: ${params.message}`);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In a real app, this would call an SMS gateway API
  return true;
}

export async function notifyListingScheduled(phone: string, date: string, time: string): Promise<boolean> {
  return sendNotification({
    to: phone,
    message: `Your Scrapy pickup has been scheduled for ${date} at ${time}. We'll be there!`,
    type: "SMS"
  });
}

export async function notifyListingCollected(phone: string, amount: number): Promise<boolean> {
  return sendNotification({
    to: phone,
    message: `Your scrap has been collected. We've initiated a payout of ₹${amount}. Thank you for using Scrapy!`,
    type: "SMS"
  });
}
