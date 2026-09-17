// IMPORTANT: This module is part of the QuickShow application. It contains the core UI or server logic for this feature and should remain behaviorally identical while editing.


// Reusable two-part heading for admin page sections.
const Title = ({ text1, text2 }) => {
  return (
    <h1 className="font-medium text-2xl">
        {text1} <span className="underline text-primary">
            {text2}
        </span>
    </h1>
  )
}

export default Title
