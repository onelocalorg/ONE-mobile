export enum FileKey {
  pic = "pic",
  coverImage = "cover_image",
  signupPic = "signup_pic",
  signupCoverImage = "signup_cover_image",
  postImage = "createPostImg",
  eventImage = "event_image",
  expenseImage = "expense_image",
  payoutImage = "payout_image",
  createEventImage = "create_event_image",
  groupImage = "group_image",
}

export interface UploadFileData {
  uploadKey: FileKey;
  resourceId?: string;
  eventId?: string;
  imageName: string;
  base64: string;
  mimeType: string;
}
