export enum FileKeys {
  pic = "pic",
  coverImage = "cover_image",
  signupPic = "signup_pic",
  signupCoverImage = "signup_cover_image",
  postImage = "createPostImg",
  eventImage = "event_image",
  expenseImage = "expense_image",
  payoutImage = "payout_image",
  createEventImage = "create_event_image",
}

export interface UploadFileData {
  uploadKey: FileKeys;
  eventId?: string;
  userId?: string;
  imageName: string;
  base64: string;
  mimeType: string;
}
