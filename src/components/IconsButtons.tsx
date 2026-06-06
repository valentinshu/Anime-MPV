type Props = {
  currentState: boolean;
  trueIcon: string;
  falseIcon: string;
};

function IconsButtons({ currentState, trueIcon, falseIcon }: Props) {
  return (
    <>
      {currentState ? (
        <img src={trueIcon} alt="Play" width={25} height={25} />
      ) : (
        <img src={falseIcon} alt="Play" width={25} height={25} />
      )}
    </>
  );
}

export default IconsButtons;
