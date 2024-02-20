import { apiConstants } from '@network/constant';
import { API } from '..';
import { getApiResponse } from '@network/utils/get-api-response';

interface LoginProps {
  emailOrMobile: string;
  password: string;
  loginType: string;
  deviceToken: string;
  version: string;
  deviceInfo: string;
  googleToken: string;
}

export const onLogin = async (props: LoginProps) => {
  let response;
  try {
    const endPoint = apiConstants.login;
    const data = await API.userService.post(endPoint, props);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export interface UserProfileProps {
  userId: string;
}

export const onGetUserProfile = async (props: UserProfileProps) => {
  let response;
  try {
    const endPoint = `${apiConstants.userProfile}/${props?.userId}`;
    console.log('11111111111',endPoint)
    const data = await API.userService.get(endPoint);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

interface EditProfileProps {
  bodyParams: {
    profile?: string;
    bio?: string;
    about?: string;
    skills?: string[];
    coverImage?: string;
    first_name?: string;
    last_name?: string;
    nick_name?:string;
  };
  userId: string;
}

export const onEditUserProfile = async (props: EditProfileProps) => {
  console.log('-------------4444---------')
  const { bodyParams, userId } = props || {};
  const { skills, about, bio, profile, coverImage,first_name,last_name,nick_name } = bodyParams || {};
  let response;
  console.log('*********************************',skills)
  try {
    console.log('-------------55555---------')
    const attachment = new FormData();

    const picData = { 
      uri: profile,
      type: 'jpg',
      name: 'profile.jpg',
    }

    const coverImgData = {
      uri: coverImage,
      type: 'jpg',
      name: 'coverImage.jpg',
    }

    const attachments = {
      'pic': JSON.stringify(picData),
      // 'cover_image' : JSON.stringify(coverImgData),
      'about': about,
      'skills': skills?.toString(),
      'bio': bio,
      'first_name':first_name,
      'last_name':last_name,
      'nick_name':nick_name
    }
    console.log('----------------attachments--------------',attachments)
    console.log('----------------attachments pic--------------',attachments.pic)
    if (profile) {
      console.log('-------------6666---------')
      attachment.append('pic', {
        uri: profile,
        type: 'jpg',
        name: 'profile.jpg',
      });
    }
    if (coverImage) {
      console.log('-------------7777---------')
      attachment.append('cover_image', {
        uri: coverImage,
        type: 'jpg',
        name: 'coverImage.jpg',
      });
    }
    if (about) {
      console.log('-------------8888---------')
      attachment.append('about', about);
    }
    if (skills?.length) {
      console.log('-------------9999---------')
      attachment.append('skills', skills);
    }
    if (bio) {
      console.log('-------------10101010---------')
      attachment.append('bio', bio);
    }
console.log(attachment,'response=== attachment attachment request')
    const endPoint = `${apiConstants.editProfile}${userId}`;
    console.log('-------------12 12 12 12---------')
    console.log(endPoint)
    const data = await API.userService.patch(endPoint, attachments, {
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
    });
    response = getApiResponse(data);
    console.log('----------------response image upload--------------',response)
  } catch (error: any) {
    response = getApiResponse(error);
    console.log('-------------11 11 11 11---------')
    console.log('response=== profile page', response, error);
  }

  return response;
};

interface SaveCustomerIdProps {
  bodyParams: {
    userId: string;
    customerId: string;
  };
}

export const onSaveCustomerId = async (props: SaveCustomerIdProps) => {
  const { bodyParams } = props || {};
  let response;

  try {
    const endPoint = apiConstants.saveCustomerId;
    const data = await API.userService.post(endPoint, bodyParams);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};

export const onGetAppConfig = async () => {
  let response;

  try {
    const endPoint = apiConstants.appConfig;
    const data = await API.userService.get(endPoint);
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
  }

  return response;
};
