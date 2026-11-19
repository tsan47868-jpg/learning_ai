import { createFileRoute } from '@tanstack/react-router'
import LegalPage, { type LegalSection } from '#/components/LegalPage'

export const Route = createFileRoute('/privacy')({ component: PrivacyPage })

const sections: LegalSection[] = [
  { title: 'Information you provide', content: <p>If you use the AI tutor, the messages in your conversation are sent to our server and on to OpenRouter, the AI service used to generate replies. Avoid entering passwords, payment details, confidential work, or other sensitive personal information. The contact form prepares an email in your own email app; it does not submit the form to this site.</p> },
  { title: 'Information stored in your browser', content: <p>The site uses local browser storage to remember your display theme and AI tutor conversation history on your device. This information stays in that browser unless you clear its site data. Tutor history can be cleared using your browser’s site data settings.</p> },
  { title: 'How information is used', content: <p>Conversation messages are used to provide tutor replies. Theme and saved conversation data are used to restore your preferences and recent learning sessions. The site code does not send the contact form to a server or create an account.</p> },
  { title: 'Service providers and retention', content: <p>AI tutor messages pass through OpenRouter and the model provider selected for the service. Their processing and retention are governed by their own policies. The site owner should confirm the current provider configuration and hosting log practices before publishing this policy; we cannot infer those practices from the site interface.</p> },
  { title: 'Your choices and questions', content: <p>You can stop using the tutor and clear browser-stored preferences or history through your browser settings. For privacy questions, contact <a className="underline" href="mailto:hello@example.com">hello@example.com</a>. This contact address is a placeholder and should be replaced by the site owner before publication.</p> },
]

function PrivacyPage() {
  return <LegalPage label="Site information" title="Privacy Policy" updated="November 19, 2026" intro={<p>This page describes the information handled by the Learning AI site and its current features. The AI tutor requires sending your prompt to an external AI service to produce a response.</p>} sections={sections} />
}
