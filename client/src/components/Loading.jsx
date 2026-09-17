// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.


// Shared loading indicator displayed while page data is being prepared.
const Loading = () => {
  return (
    <div className='flex justify-center items-center h-[80vh]'>
      <div className='animate-spin rounded-full h-14 w-14 border-2 
      border-t-primary'></div>
    </div>
  )
}

export default Loading