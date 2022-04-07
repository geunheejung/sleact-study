import { IChat, IDM } from "@typings/db";
import dayjs from "dayjs";

export default <T extends IDM | IChat>(chatList: T[]) => {
  const sections: { [key: string]: Array<T> } = {};

  chatList.forEach((chat) => {
    const monthDate = dayjs(chat.createdAt).format('YYYY-MM-DD');
    if (Array.isArray(sections[monthDate])) {
      
      sections[monthDate].push(chat);
    } else {
      sections[monthDate] = [chat];
    }
  });
  
  return sections;
};