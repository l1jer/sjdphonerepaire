export default function Map() {
  return (
    <section id="map" className="relative bg-background-light dark:bg-background-dark py-24">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-background-DEFAULT/20 to-transparent dark:from-background-darker/20" />
      <div className="absolute right-0 top-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl dark:bg-accent/5" />
      <div className="absolute left-0 bottom-20 h-64 w-64 rounded-full bg-brand/5 blur-3xl dark:bg-accent/5" />

      <div className="container relative mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-brand dark:text-text-inverse">
            Find Our Store
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-text-dark dark:text-text-inverse/80">
            Located in the heart of Ocean Grove, we&apos;re here to provide expert phone repair services when you need them.
          </p>
        </div>

        <div className="relative rounded-3xl border border-neutral-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-background-darker">
          <div className="grid md:grid-cols-5 lg:grid-cols-7">
            {/* Store Information */}
            <div className="space-y-8 p-8 md:col-span-2 lg:col-span-3 lg:p-12">
              {/* Location */}
              <div>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 dark:bg-accent/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className="h-4 w-4 text-brand dark:text-accent">
                      <path fillRule="evenodd" d="m11.54 22.351.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-brand dark:text-text-inverse">Store Address</h3>
                </div>
                <div className="ml-10 space-y-2">
                  <p className="text-lg text-text-dark dark:text-text-inverse/90">
                    Tenancy 7C Kingston Village Shopping Centre
                    <br />
                    122-160 Grubb Road
                    <br />
                    Ocean Grove, VIC 3226
                  </p>
                  <p className="text-base text-text-dark/70 dark:text-text-inverse/60">
                    Near Lotto & Gifts, Pretty&apos;s Place Coffee & Friends
                  </p>
                </div>
              </div>

              {/* Hours */}
              <div>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 dark:bg-accent/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className="h-4 w-4 text-brand dark:text-accent">
                      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 6a.75.75 0 0 0-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 0 0 0-1.5h-3.75V6Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-brand dark:text-text-inverse">Opening Hours</h3>
                </div>
                <div className="ml-10 space-y-1">
                  <div className="flex justify-between text-lg text-text-dark dark:text-text-inverse/90">
                    <span>Monday - Friday</span>
                    <span className="font-medium">9:00 am - 5:30 pm</span>
                  </div>
                  <div className="flex justify-between text-lg text-text-dark dark:text-text-inverse/90">
                    <span>Saturday</span>
                    <span className="font-medium">9:00 am - 5:00 pm</span>
                  </div>
                  <div className="flex justify-between text-lg text-brand/80 dark:text-accent/80">
                    <span>Sunday</span>
                    <span>10:00 am - 4:00 pm</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <div className="mb-4 flex items-center space-x-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 dark:bg-accent/10">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"
                      className="h-4 w-4 text-brand dark:text-accent">
                      <path fillRule="evenodd" d="M1.5 4.5a3 3 0 0 1 3-3h1.372c.86 0 1.61.586 1.819 1.42l1.105 4.423a1.875 1.875 0 0 1-.694 1.955l-1.293.97c-.135.101-.164.249-.126.352a11.285 11.285 0 0 0 6.697 6.697c.103.038.25.009.352-.126l.97-1.293a1.875 1.875 0 0 1 1.955-.694l4.423 1.105c.834.209 1.42.959 1.42 1.82V19.5a3 3 0 0 1-3 3h-2.25C8.552 22.5 1.5 15.448 1.5 6.75V4.5Z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-brand dark:text-text-inverse">Contact Us</h3>
                </div>
                <div className="ml-10 space-y-2">
                  <a href="tel:0410422772"
                    className="block text-lg text-text-dark dark:text-text-inverse/90">
                    0410 422 772
                  </a>
                  <a href="mailto:sjdphonerepair@gmail.com"
                    className="block text-lg text-text-dark dark:text-text-inverse/90">
                    sjdphonerepair@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="md:col-span-3 lg:col-span-4">
              <div className="h-full min-h-[400px] w-full">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3133.4359963740035!2d144.53720061095186!3d-38.24619295344965!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad4390c00f8c39d%3A0x182f4c9f9d5e141c!2sSJD%20Tech%20Phone%20%26%20Tablet%20Repairs!5e0!3m2!1sen!2sau!4v1756817594224!5m2!1sen!2sau"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full min-h-[400px] w-full rounded-b-3xl md:rounded-l-none md:rounded-r-3xl"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}