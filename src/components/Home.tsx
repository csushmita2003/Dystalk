import Animation from "./Animation";

const Home = () => {
  return (
    <div className="p-6 flex flex-col items-center text-center">
      <h1 className="text-4xl font-bold mb-6">Understanding Dysarthria</h1>

      <p className="max-w-2xl mb-4 text-lg text-slate-700">
        Dysarthria is a motor speech disorder resulting from neurological injury.
        It affects the muscles used for speaking, making it difficult to pronounce words clearly.
        Individuals may sound slurred, slow, or have trouble controlling volume.
      </p>

      <p className="max-w-2xl mb-6 text-lg text-slate-600">
        Conditions such as Parkinson's disease, stroke, cerebral palsy, ALS, and multiple sclerosis 
        are common causes of dysarthria. Our tool helps convert impaired speech into clear text using AI.
      </p>

      <Animation />
    </div>
  );
};

export default Home;
