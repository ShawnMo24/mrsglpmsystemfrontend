# LPM V2 - Life Preservation Model Complete System

A comprehensive life preservation and dispatch command center application featuring real-time coordination between dispatchers, responders, and citizens.

## System Interfaces

- **Dashboard** (`/`) - Central operations command dashboard
- **Dispatch Board** (`/dispatcher`) - Dispatch command interface for managing incidents
- **Responder Interface** (`/responder`) - Field responder view for assignments
- **Citizen Portal** (`/citizen`) - Public interface for citizens to report incidents
- **Brain Interface** (`/brain`) - AI-powered voice/text assistant
- **Mind Center** (`/console`) - Cognitive analytics and decision support

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5000`

## Deployment to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add your environment variables (see below)
4. Deploy

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy (follow prompts)
vercel
```

## Environment Variables

Add these in your Vercel project settings under Environment Variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `OPENAI_API_KEY_GOOGLE` | Google Gemini API key (Gemini 2.5 Flash Lite) | Pick one |
| `OPENAI_API_KEY_DEEPSEEK` | DeepSeek API key | Pick one |
| `OPENAI_API_KEY` | OpenAI API key (GPT-4o) | Pick one |
| `OPENAI_API_KEY_MAPBOX` | MapBox access token for maps | Yes |

**Note:** You only need ONE AI provider key (Google, DeepSeek, or OpenAI). The system will automatically use whichever is available, with priority: Google > DeepSeek > OpenAI.

### AI Provider Priority

1. **Google Gemini** (if `OPENAI_API_KEY_GOOGLE` is set) - Uses Gemini 2.5 Flash Lite
2. **DeepSeek** (if `OPENAI_API_KEY_DEEPSEEK` is set) - Uses DeepSeek Chat
3. **OpenAI** (if `OPENAI_API_KEY` is set) - Uses GPT-4o

## Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express (or Vercel Serverless Functions)
- **AI**: Google Gemini / DeepSeek / OpenAI (configurable)
- **Maps**: MapBox for real-time incident mapping

## Important Safety Notice

This is a **support coordination system**, not an emergency service.

For life-threatening emergencies, always call **911**.

The LPM system is designed to:
- Coordinate non-emergency support resources
- Provide wellness checks and community assistance
- Connect citizens with appropriate services
- Support responders with AI-powered guidance

## Project Structure

```
├── api/                    # Vercel serverless functions
│   ├── brain.js           # AI assistant (multi-provider)
│   ├── mapbox.js          # MapBox token endpoint
│   ├── incidents.js       # Incident management
│   └── responders.js      # Responder management
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── contexts/      # React contexts
│   │   └── pages/         # Page components
│   └── index.html
├── server/                 # Express backend (for local dev)
├── shared/                 # Shared types and schemas
├── vercel.json            # Vercel configuration
└── package.json
```

## License

Proprietary - The Moore Resource & Strategy Group (MRSG)
