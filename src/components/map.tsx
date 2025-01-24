export default function Map() {
  return (
    <section id="map" className="bg-body-background py-24 dark:bg-dark">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold text-dark dark:text-white">
            Find Us
          </h2>
          <p className="mx-auto max-w-2xl text-body dark:text-body">
            Visit our store for fast and professional phone repair services.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-body/10 bg-white p-8 dark:border-dark/10 dark:bg-dark/50">
            <h3 className="mb-4 text-2xl font-bold text-dark dark:text-white">
              Store Location
            </h3>
            <div className="space-y-4 text-body dark:text-body">
              <p>
                <strong className="text-dark dark:text-white">Address:</strong>
                <br />
                123 Main Street
                <br />
                Sydney, NSW 2000
              </p>
              <p>
                <strong className="text-dark dark:text-white">Hours:</strong>
                <br />
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
              <p>
                <strong className="text-dark dark:text-white">Phone:</strong>
                <br />
                (02) 1234 5678
              </p>
            </div>
          </div>

          <div className="relative h-[400px] overflow-hidden rounded-2xl">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26537.90346920582!2d151.20769367749024!3d-33.86882975!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6b12ae401e8b983f%3A0x5017d681632ccc0!2sSydney%20NSW%202000!5e0!3m2!1sen!2sau!4v1708561547959!5m2!1sen!2sau"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
            />
          </div>
        </div>
      </div>
    </section>
  )
}