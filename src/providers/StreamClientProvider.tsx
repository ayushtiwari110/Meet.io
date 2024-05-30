"use client";
import { useUser } from '@clerk/nextjs';
import {
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  User,
} from '@stream-io/video-react-sdk';
import { useEffect, useState } from 'react';
import { tokenProvider } from '../actions/stream.actions';
import Loader from '@/components/Loader';
const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY; //we'll use it in use server actions file
// const userId = 'user-id';
// const token = 'authentication-token';
// const user: User = { id: userId };

// const client = new StreamVideoClient({ apiKey, user, token });
// const call = client.call('default', 'my-first-call');
// call.join({ create: true });

const StreamVideoProvider = ({children} : {children: React.ReactNode}) => {

  const [videoClient, setvideoClient] = useState<StreamVideoClient>()
  const { user, isLoaded} = useUser();
  useEffect(() => {
    if(!isLoaded || !user) return;
    if(!apiKey) throw new Error('Stream API Key missing')

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user?.id,
        name: user?.username || user?.id,
        image: user?.imageUrl
      },
      tokenProvider,
    })  

    setvideoClient(client);
  }, [user, isLoaded])

  if(!videoClient) return <Loader />

  return (
    <StreamVideo client={videoClient}>
      {/* <StreamCall call={call}>
      </StreamCall> */}
      {children}
    </StreamVideo>
  );
};

export default StreamVideoProvider;