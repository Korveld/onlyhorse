"use client";
import { CldVideoPlayer } from 'next-cloudinary';

const TodaysHighlight = () => {
  return (
    <div className="w-full md:w-3/4 mx-auto">
      <CldVideoPlayer
        id="default"
        controls
        width="960"
        height="540"
        className="rounded-md"
        src="highlighted-vid_hmtkrt"
      />
    </div>
  )
}
export default TodaysHighlight
