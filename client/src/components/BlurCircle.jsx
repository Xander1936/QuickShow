// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.

// Decorative blurred background circle positioned by the parent component.
const BlurCircle = ({top = "auto", left = "auto", right = "auto", bottom = "auto"}) => {
  return (
    <div className="absolute -z-50 h-58 w-58 aspect-square rounded-full 
    bg-primary/30 blur-3xl" 
    style={{top: top, left: left, right: right, bottom: bottom }} >
      
    </div>
  )
}

export default BlurCircle
