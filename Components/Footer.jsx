import { Fot1, Fot2 } from "../Components/index";

export default () => {
  const footerNavs = [
    {
      href: "javascript:void(0)",
      name: "Terms",
    },
    {
      href: "javascript:void(0)",
      name: "License",
    },
    {
      href: "javascript:void(0)",
      name: "Privacy",
    },
    {
      href: "javascript:void(0)",
      name: "About us",
    },
  ];
  return (
    <footer className="pt-10">
      <div className="max-w-screen-xl mx-auto px-4 text-gray-600 md:px-8">
        <div className="justify-between sm:flex">
          <div className="space-y-6">
            <img
              src="https://imageio.forbes.com/blogs-images/bernardmarr/files/2018/03/AdobeStock_188056752-1200x652.jpeg?format=jpg&width=1440"
              className="w-32"
            />
            <p className="max-w-md">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>
            <ul className="flex flex-wrap items-center gap-4 text-sm sm:text-base">
              {footerNavs.map((item, idx) => (
                <li className="text-gray-800 hover:text-gray-500 duration-150">
                  <a key={idx} href={item.href}>
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <p className="text-gray-700 font-semibold">Get the App</p>
            <div className="flex items-center gap-3 mt-3 sm:block">
              <a href="javascript:void()">
                <Fot1 />
              </a>
              <a href="javascript:void()" className="mt-0 black sm:mt-3">
                <Fot2 />
              </a>
            </div>
          </div>
        </div>
        <div className="t-10 border-t md:text-center">
          <p>@ 2025 Mukesh Pathania. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};
