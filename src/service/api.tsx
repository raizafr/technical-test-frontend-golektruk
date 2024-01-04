import fetchAPI from "@/config/axios";

export async function register({
  email,
  name,
  phone,
  password,
  age,
  photos,
}: {
  email: string;
  name: string;
  phone: string;
  password: string;
  age: number;
  photos: string[];
}) {
  try {
    console.log({email,
      name,
      phone,
      password,
      age,
      photos,})
    const response = await fetchAPI("POST", "user", {
      email,
      name,
      phone,
      password,
      age,
      photos,
    });
    return response;
  } catch (err) {
    return err;
  }
}

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  try {
    const response = await fetchAPI("POST", "login", {
      username,
      password,
    },{
      "content-type":"application/x-www-form-urlencoded"
    });
    return response;
  } catch (err) {
    return err;
  }
}

export async function me(token:string) {
  try {
    const response = await fetchAPI("GET", "user/me",null,{
      Authorization: `bearer ${token}`,
    });
    return response;
  } catch (err) {
    return err;
  }
}

export async function uploadImage(image:File) {
  const formData= new FormData()
  formData.append('file',image)
    try{
      const response = await fetchAPI('POST','user/photo/upload',formData)
      return response;
    }catch(err){
      return err;
    }
}

export async function logoutUser(token:string) {
  try{
    const response = await fetchAPI('POST','user/logout/all',null,{
      Authorization: `bearer ${token}`,
    })
    return response;
  }catch(err){
    return err;
  }
}

export async function analytic(token:string,date:string){
  try{
    const response = await fetchAPI('GET',`analytic/click?listing_date=${date}`,null,{
      Authorization: `bearer ${token}`,
    })
    return response;
  }catch(err){
    return err;
  }
}