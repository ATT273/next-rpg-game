"use client";

import CreateCharacterProvider from "./_components/CreateCharacterProvider";
import PageContent from "./_components/PageContent";

const CreateCharacter = () => {
  return (
    <CreateCharacterProvider>
      <div className="create-character-wrapper relative m-auto p-3">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2 w-full">
          <h1 className="title font-bold text-3xl text-center">
            Create Your Character
          </h1>
          <PageContent />
        </div>
      </div>
    </CreateCharacterProvider>
  );
};

export default CreateCharacter;
