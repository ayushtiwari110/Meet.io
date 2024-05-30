"use client";
import Image from 'next/image';
import React, { useState } from 'react'
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from './ui/use-toast';
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker';
import { Input } from './ui/input';
const MeetingTypeList = () => {
  const router = useRouter()
  const [meetingState, setmeetingState] = useState<'isScheduledMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
  const {user} = useUser();
  const client = useStreamVideoClient();
  const [meetInfo, setmeetInfo] = useState({
    dateTime: new Date(),
    description: '',
    link: ''
  })
  const [callDetails, setcallDetails] = useState<Call>()
  const {toast} = useToast();

  const createMeeting = async () => {
    if(!client || !user) return;

    try {
      if(!meetInfo.dateTime) {
        toast({
          title: "Please select a date and time",
        })
        return;
      }
      const id = crypto.randomUUID();
      const call = client.call('default',id);

      if(!call) throw new Error('Failed to create call');

      const startsAt = meetInfo.dateTime.toISOString() || new Date(Date.now()).toISOString();
      const description = meetInfo.description || 'Instant Meeting';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description
          }
        }
      })
      setcallDetails(call)

      if(!meetInfo.description) {
        router.push(`/meeting/${call.id}`)
      }
      toast({
        title: "Meeting Created!",
      })
    } catch (error) {
      console.log(error)
      toast({
        title: "Failed to create Meeting",
      })
    }
  }

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
      <HomeCard 
        img="/icons/add-meeting.svg"
        title="New Meeting"
        description="Start an Instant Meeting"
        handleClick={() => setmeetingState('isInstantMeeting')}
        className="bg-orange-1"
      />
      <HomeCard 
        img="/icons/schedule.svg"
        title="Schedule Meeting"
        description="Plan your Meeting"
        handleClick={() => setmeetingState('isScheduledMeeting')}
        className="bg-blue-1"
      />
      <HomeCard 
        img="/icons/recordings.svg"
        title="View Recordings"
        description="Check out your recordings"
        handleClick={() => router.push('/recordings')}
        className="bg-purple-1"
      />
      <HomeCard 
        img="/icons/join-meeting.svg"
        title="Join Meeting"
        description="via invitation link"
        handleClick={() => setmeetingState('isJoiningMeeting')}
        className="bg-yellow-1"
      />
      {!callDetails ? (
        <MeetingModal 
        isOpen={meetingState === 'isScheduledMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Create Meeting"
        handleClick={createMeeting}
      >
        <div className='flex flex-col gap-2.5'>
          <label className='text-base text-normal leading-[22px] text-sky-2'>Add a description</label>
          <Textarea  className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
            onChange={(e) => {
              setmeetInfo({...meetInfo, description: e.target.value})
            }}
          />
        </div>
        <div className='flex w-full flex-col gap-2.5'>
        <label className='text-base text-normal leading-[22px] text-sky-2'>Select Date and Time</label>
        <ReactDatePicker 
          selected={meetInfo.dateTime}
          onChange ={(date) => setmeetInfo({...meetInfo, dateTime: date!})}
          showTimeSelect
          timeFormat="HH:mm"
          timeIntervals={15}
          timeCaption="time"
          dateFormat="MMMM d, yyyy h:mm aa"
          className='w-full rounded bg-dark-3 p-2 focus:outline-none'
        />
        </div>
      </MeetingModal>
      ) : (
        <MeetingModal 
        isOpen={meetingState === 'isScheduledMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Meeting Created"
        handleClick={() => {
          navigator.clipboard.writeText(meetingLink);
          toast({title: 'Link Copied'})

        }}
        image="/icons/checked.svg"
        buttonIcon = "/icons/copy.svg"
        buttonText = "Copy Meeting Link"
      />
      )}
      <MeetingModal 
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Start an Instant Meeting"
        buttonText="Start Meeting"
        handleClick={createMeeting}
      />
      <MeetingModal 
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setmeetingState(undefined)}
        title="Type the link here"
        buttonText="Join Meeting"
        handleClick={() => router.push(meetInfo.link)}
      >
        <Input
          placeholder="Meeting Link" 
          className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'  
          onChange={(e) => setmeetInfo({...meetInfo, link: e.target.value})}
        />
      </MeetingModal>
    </section>
  )
}

export default MeetingTypeList