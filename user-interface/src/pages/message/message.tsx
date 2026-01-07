import { Typography } from '@components/typography';
import { ConversationDetail, ConversationSidebar } from './components';
import { Route, Routes, useNavigate } from 'react-router-dom';
import useBreakPoint from '@hooks/use-breakpoint';
import React from 'react';

//----------------------------------------------------------------------

export default function Message() {
  const navigate = useNavigate();
  const { breakpoint } = useBreakPoint();
  const [showDetailOnly, setShowDetailOnly] = React.useState(false);

  const isMobile = breakpoint === 'sm';
  const hideConsolidation = breakpoint === 'sm' || breakpoint === 'md';

  const handleConversationClick = (id: any) => {
    if (isMobile) {
      setShowDetailOnly(true);
    }
    navigate(`/messages/${id}`);
  };

  return (
    <section className="w-full h-full flex flex-col justify-start transition-all duration-[0.5s] lg:flex-row lg:items-start">
      {!isMobile || !showDetailOnly ? (
        <ConversationSidebar onConversationClick={handleConversationClick} />
      ) : null}

      <Routes>
        <Route path=":id" element={<ConversationDetail />} />

        <Route
          path=""
          element={
            !hideConsolidation ? (
              <section className="bg-surface h-screen w-full grow flex flex-col justify-center items-center gap-3 py-[1.75rem]">
                <img
                  src="/svg/ai_data_consolidation.svg"
                  alt="no-followers"
                  className="w-fit object-contain mb-[1.75rem]"
                />
                <Typography level="title" className="text-primary opacity-60">
                  Select conversation
                </Typography>
                <Typography
                  level="base2r"
                  className="text-secondary opacity-50"
                >
                  To start messaging
                </Typography>
              </section>
            ) : null
          }
        />
      </Routes>
    </section>
  );
}
