export default function Home() {
  return (
    <div>
      <div className="flex flex-col h-screen items-center justify-center text-white ">
        <div className="flex flex-col items-center gap-[5rem] ">
          <div className="headingText text-[#c0fb50] ">AI Your Notion</div>
          <div className="flex flex-col items-center gap-[1rem]">
            <div>Choose any Topic you like .</div>
            <div>Fill in your notion details .</div>
            <div>
              Make AI generate new notion Page for you with information on the
              topic .
            </div>
            <div>
              {
                " As a bonus the page also consists a Youtube Link (and it's summary if you can't watch the whole thing ) "
              }
            </div>
          </div>
          <br />
        </div>
      </div>
      <div className="flex h-screen items-center justify-center text-white">
        <div className="w-[25rem] "></div>
      </div>
    </div>
  );
}
