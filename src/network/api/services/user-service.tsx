import {apiConstants} from '@network/constant';
import {API} from '..';
import {getApiResponse} from '@network/utils/get-api-response';

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
  };
  userId: string;
}

export const onEditUserProfile = async (props: EditProfileProps) => {
  const {bodyParams, userId} = props || {};
  const {skills, about, bio, profile, coverImage} = bodyParams || {};
  let response;
  try {
    const attachment = new FormData();
    if (profile) {
      attachment.append('pic', {
        uri: profile,
        type: 'jpg',
        name: 'profile.jpg',
      });
    }
    if (coverImage) {
      attachment.append('cover_image', {
        uri: coverImage,
        type: 'jpg',
        name: 'coverImage.jpg',
      });
    }
    if (about) {
      attachment.append('about', about);
    }
    if (skills?.length) {
      attachment.append('skills', skills);
    }
    if (bio) {
      attachment.append('bio', bio);
    }

    const endPoint = `${apiConstants.editProfile}/${userId}`;
    const data = await API.userService.patch(endPoint, attachment, {
      headers: {
        'content-type': 'multipart/form-data',
      },
    });
    response = getApiResponse(data);
  } catch (error: any) {
    response = getApiResponse(error);
    console.log('response===', response, error);
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
  const {bodyParams} = props || {};
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
