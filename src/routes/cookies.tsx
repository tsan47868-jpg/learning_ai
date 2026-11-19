import { createFileRoute } from '@tanstack/react-router'
import LegalPage, { type LegalSection } from '#/components/LegalPage'

export const Route = createFileRoute('/cookies')({ component: CookiesPage })

const sections: LegalSection[] = [
  { title: 'Cookies on this site', content: <p>The current Learning AI app does not set cookies for its own theme or tutor-history features. Instead, it stores those preferences in your browser’s local storage, which is separate from cookies.</p> },
  { title: 'Browser storage', content: <p>Local storage remembers your selected theme and AI tutor conversation history on this device and in this browser. You can remove it by clearing this site’s stored data in your browser settings. Clearing site data may also reset other preferences.</p> },
  { title: 'Third-party services', content: <p>When you use the AI tutor, your messages are sent to an AI service to generate a reply. That provider may use its own technologies under its own policies. Hosting or infrastructure providers may also use technical logs; the site owner should confirm the deployed services and their practices.</p> },
  { title: 'Policy changes and contact', content: <p>If the site adds cookies or changes its storage practices, this page should be updated. Questions can be sent to <a className="underline" href="mailto:hello@example.com">hello@example.com</a>; this address is a placeholder to be replaced before publication.</p> },
]

function CookiesPage() {
  return <LegalPage label="Site information" title="Cookie Policy" updated="November 19, 2026" intro={<p>Here is how this site currently uses cookies and similar browser storage technologies.</p>} sections={sections} />
}
