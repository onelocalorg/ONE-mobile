export interface ApiResponse<Resource> {
  success: boolean;
  code: number;
  message: string;
  data?: Resource;
}
