import { IDM, IUser } from "@typings/db";

const getMockChatData = (chat: string, myData: IUser, userData: IUser): IDM => {          
  return {   
    id: 0,     
    content: chat,
    Sender: myData,
    SenderId: myData?.id,
    ReceiverId: userData.id,
    Receiver: userData,
    createdAt: new Date(),
  }
}

export default getMockChatData;