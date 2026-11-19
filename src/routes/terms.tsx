import { createFileRoute } from '@tanstack/react-router'
import LegalPage, { type LegalSection } from '#/components/LegalPage'

export const Route = createFileRoute('/terms')({ component: TermsPage })

const sections: LegalSection[] = [
  { title: 'Using this site', content: <p>You may use Learning AI to explore educational material and the learning tools offered here. Please use the site lawfully, respect other people’s rights, and do not interfere with its operation or attempt to access it without permission.</p> },
  { title: 'Learning content and AI responses', content: <p>Articles, examples, and AI-generated responses are provided for general educational purposes. AI responses can be incomplete or inaccurate and are not professional, legal, financial, medical, or security advice. Check important information with reliable sources before acting on it.</p> },
  { title: 'Your content', content: <p>You retain rights to the messages and other material you submit. You give us permission to process that material only as needed to provide the feature you use, such as sending a tutor message to the AI service that generates a reply. Do not submit confidential or sensitive information.</p> },
  { title: 'Third-party services and links', content: <p>Some features rely on third-party services, and this site may link to other websites. Those services and sites have their own terms and privacy practices. We do not control or endorse every third-party service or the material it provides.</p> },
  { title: 'Availability and changes', content: <p>We may update, suspend, or remove site features or content as the project develops. The site is provided as available, without a promise that it will always be uninterrupted or error-free. We may revise these terms by publishing an updated version on this page.</p> },
  { title: 'Contact', content: <p>Questions about these terms? Email <a className="underline" href="mailto:hello@example.com">hello@example.com</a>. This address is a placeholder and should be replaced by the site owner before publication.</p> },
]

function TermsPage() {
  return <LegalPage label="Site information" title="Terms & Conditions" updated="November 19, 2026" intro={<p>These terms explain the basic rules for using Learning AI. By using the site, you agree to these terms. If you do not agree, please do not use the site.</p>} sections={sections} />
}
