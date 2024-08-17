import { IconChevronsUp } from '@tabler/icons-react';
import { useWindowScroll } from '@mantine/hooks';
import { Affix, Button, Transition } from '@mantine/core';

export function ToTopButton() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <>
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              variant="transparent"
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              <IconChevronsUp color="white" size={40} stroke={2} />
            </Button>
          )}
        </Transition>
      </Affix>
    </>
  );
}
