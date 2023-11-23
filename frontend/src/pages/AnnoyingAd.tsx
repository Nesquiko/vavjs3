import { useEffect, useState } from 'react';
import { Ad, User } from '../model';

interface AnnoyingAdProps {
  showAfterSecs: number;
  ad: Ad;
  user?: User;
}

const AD_WIDTH = 300;
const AD_HEIGHT = 300;
const CLOSE_AFTER_CLOSES = 3;

// source https://stackoverflow.com/questions/4959975/generate-random-number-between-two-numbers-in-javascript
function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export const AnnoyingAd = ({ ad, showAfterSecs, user }: AnnoyingAdProps) => {
  const [open, setOpen] = useState(false);
  const [adTimer, setAdTimer] = useState(0);
  const [closes, setCloses] = useState(1);
  const [posX, setPosX] = useState(
    randInt(0 + AD_WIDTH, window.innerWidth - AD_WIDTH),
  );
  const [posY, setPosY] = useState(
    randInt(0 + AD_HEIGHT, window.innerHeight - AD_HEIGHT),
  );

  const addClicked = async () => {
    await fetch(import.meta.env.VITE_BACKEND_URL + `/ad/${ad.id}`, {
      method: 'PUT',
    });
  };

  const relocate = () => {
    setPosX(randInt(0 + AD_WIDTH, window.innerWidth - AD_WIDTH));
    setPosY(randInt(0 + AD_HEIGHT, window.innerHeight - AD_HEIGHT));
  };

  // source https://stackoverflow.com/questions/68685880/how-to-increment-a-react-state-every-second-using-setinterval
  useEffect(() => {
    let intervalId = setInterval(() => {
      if (user?.name === 'admin') {
        clearInterval(intervalId);
        return;
      }

      setAdTimer((adTimer) => adTimer + 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (adTimer === showAfterSecs && ad) {
      console.log('openneing ad at', new Date());
      setOpen(true);
    }
  }, [adTimer]);

  return (
    <>
      {open && (
        <div className="fixed z-10 h-screen w-screen bg-black/50">
          <div
            style={{
              left: `${posX}px`,
              top: `${posY}px`,
              width: `${AD_WIDTH}px`,
              height: `${AD_HEIGHT}px`,
            }}
            className="bg-white p-4 rounded relative "
          >
            <div className="flex justify-end">
              <button
                className="text-xl"
                onClick={() => {
                  setCloses(closes + 1);
                  if (closes !== CLOSE_AFTER_CLOSES) {
                    relocate();
                    return;
                  }
                  setCloses(1);
                  setOpen(false);
                  setAdTimer(0);
                }}
              >
                X
              </button>
            </div>
            <img
              src={ad.imageUrl}
              className="w-full h-auto cursor-pointer"
              onClick={() => {
                window.open(ad.link, '_blank');
                setOpen(false);
                setAdTimer(0);
                addClicked();
                setCloses(1);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
};
