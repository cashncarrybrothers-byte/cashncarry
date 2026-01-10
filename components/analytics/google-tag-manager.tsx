/**
 * Google Tag Manager Component
 * Integrates GTM tracking for the entire site
 *
 * DISABLED: Old Ideal Indiska tracking code removed (GTM-NMWTPV89)
 * TODO: Add Brothers Cash & Carry GTM ID when available
 */

import Script from 'next/script';

export function GoogleTagManager() {
  // DISABLED: Old Ideal Indiska GTM ID removed
  // const GTM_ID = 'GTM-NMWTPV89'; // OLD - Ideal Indiska

  // TODO: Add your Brothers Cash & Carry GTM ID here:
  // const GTM_ID = 'GTM-XXXXXXXX'; // Brothers Cash & Carry

  // Return null to disable tracking until new GTM ID is added
  return null;

  // Uncomment below when you have a new GTM ID:
  /*
  return (
    <>
      <Script
        id="gtm-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');
          `,
        }}
      />
    </>
  );
  */
}

export function GoogleTagManagerNoScript() {
  // DISABLED: Old Ideal Indiska GTM ID removed
  // const GTM_ID = 'GTM-NMWTPV89'; // OLD - Ideal Indiska

  // Return null to disable tracking until new GTM ID is added
  return null;

  // Uncomment below when you have a new GTM ID:
  /*
  const GTM_ID = 'GTM-XXXXXXXX'; // Brothers Cash & Carry

  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: 'none', visibility: 'hidden' }}
      />
    </noscript>
  );
  */
}
