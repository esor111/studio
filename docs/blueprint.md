# **App Name**: Goal Getter

## Core Features:

- Dashboard Overview: Dashboard providing a visual overview of the user's global money goal, current earnings, and progress percentage.
- Global Goal Management: Editable global money goal with real-time updates to progress tracking. The updates use API endpoint PUT http://localhost:3000/api/dashboard/global-goal
- Topic List: Topic list displaying title, category, completion percentage, and earnings, sourced from the service layer using data from endpoint GET http://localhost:3000/api/dashboard .
- Category Management: Category creation tool allowing the user to specify what kind of habit/topic to log.
- Topic Details: Detailed view for each topic, including title, category, notes, URLs, money per 5 reps, and subtopics sourced from endpoint GET http://localhost:3000/api/topics/:topicId
- Subtopic List: A list of subtopics where you can view or log status updates that get synced to your overall Goal progression
- Rep Counter: Toggle to increase or decrease reps completed. Visual celebration upon completion of reps. Endpoint used to log reps http://localhost:3000/api/sub-topics/:subTopicId/reps.

## Style Guidelines:

- Primary color: HSL 210, 60%, 50% (RGB Hex: #3385FF) for a professional and trustworthy feel, conveying stability and progress.
- Background color: HSL 210, 20%, 95% (RGB Hex: #F0F5FF) to provide a clean and calm backdrop that doesn't distract from the content.
- Accent color: HSL 180, 60%, 50% (RGB Hex: #33FFD1) as a contrasting highlight to draw attention to CTAs and important elements.
- Headline font: 'Space Grotesk' sans-serif. To be paired with 'Inter' for body text.
- Body font: 'Inter' sans-serif.
- Use consistent and clear icons for categories and actions, ensuring they are easily understandable at a glance. Prefer a simple, modern style.
- Maintain a clean and structured layout with clear sections for the dashboard, topic list, and topic details. Use white space effectively to avoid clutter.
- Implement subtle animations for rep count updates and goal completion, providing positive feedback to the user without being distracting. Type: fly-in or fly-out, as indicated.