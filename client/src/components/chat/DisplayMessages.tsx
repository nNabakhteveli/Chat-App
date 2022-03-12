import { MessageInterface } from "../interfaces";
import { nanoid } from 'nanoid';


export const DisplayMessages = (props: { messagesData: MessageInterface[] }) => {
   return(
     <div className='chatContainer'>
         {
           props.messagesData.length > 0 ? props.messagesData.map(({ userWhoSent, msg }: MessageInterface) => <h3 key={nanoid()}>{userWhoSent}: {msg}</h3>) : null
         } 
     </div>
   );
 }