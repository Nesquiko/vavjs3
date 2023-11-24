import { useEffect, useState } from 'react';
import { RideEntry, RideEntryType } from '../model';
import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
} from 'chart.js';
import { RidesList } from '../components/RidesList';
import { Regressor, linearRegression } from '../lib/linearreg';
import { useNavigate } from 'react-router-dom';

interface RideGraphsProps {
  rides?: RideEntry[];
}

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
);

export const RideGraphs = ({ rides }: RideGraphsProps) => {
  const navigate = useNavigate();
  const [filterFrom, setFilterFrom] = useState<Date | undefined>(undefined);
  const [filterTo, setFilterTo] = useState<Date | undefined>(undefined);
  const [filterEntryType, setFilterEntryType] = useState<RideEntryType>(
    RideEntryType.ROUTE,
  );

  const rideTypeToColor = {
    [RideEntryType.ROUTE]: 'blue',
    [RideEntryType.DURATION]: 'green',
    [RideEntryType.CONSUMPTION]: 'red',
  };

  const dataByType = {
    [RideEntryType.ROUTE]: (rides ?? [])
      .filter((ride) => ride.rideEntryType === RideEntryType.ROUTE)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [RideEntryType.DURATION]: (rides ?? [])
      .filter((ride) => ride.rideEntryType === RideEntryType.DURATION)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [RideEntryType.CONSUMPTION]: (rides ?? [])
      .filter((ride) => ride.rideEntryType === RideEntryType.CONSUMPTION)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  };

  const [data, setData] = useState<RideEntry[]>(dataByType[filterEntryType]);
  const [linReg, setLinReg] = useState<Regressor>(
    linearRegression(
      data.map((ride) => ({
        x: new Date(ride.date),
        y: ride.value / 100,
      })),
    ),
  );

  useEffect(() => {
    const filteredRides = (rides ?? []).filter((ride) => {
      if (filterFrom && new Date(ride.date) < filterFrom) {
        return false;
      }

      if (filterTo && new Date(ride.date) > filterTo) {
        return false;
      }

      return true;
    });

    dataByType[RideEntryType.ROUTE] = filteredRides
      .filter((ride) => ride.rideEntryType === RideEntryType.ROUTE)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    dataByType[RideEntryType.DURATION] = filteredRides
      .filter((ride) => ride.rideEntryType === RideEntryType.DURATION)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    dataByType[RideEntryType.CONSUMPTION] = filteredRides
      .filter((ride) => ride.rideEntryType === RideEntryType.CONSUMPTION)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setData(dataByType[filterEntryType]);
    setLinReg(
      linearRegression(
        dataByType[filterEntryType].map((ride) => ({
          x: new Date(ride.date),
          y: ride.value / 100,
        })),
      ),
    );
  }, [filterFrom, filterTo, filterEntryType]);

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => navigate('/home')}
      >
        Back to Rides Dashboard
      </button>

      <div className="flex gap-4 p-4 justify-around">
        {Object.values(RideEntryType).map((rideEntryType) => (
          <button
            key={rideEntryType}
            className={`${
              filterEntryType === rideEntryType
                ? 'bg-blue-500'
                : 'bg-gray-300 hover:bg-gray-400'
            } text-white w-40 font-bold py-2 px-4 rounded`}
            onClick={() => setFilterEntryType(rideEntryType)}
          >
            {rideEntryType.charAt(0).toUpperCase() + rideEntryType.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex gap-8 justify-around">
        <label>
          Start date
          <input
            type="date"
            className="border rounded w-80 p-2 text-gray-700 leading-tight"
            onChange={(e) => setFilterFrom(new Date(e.target.value))}
          />
        </label>
        <label>
          End date
          <input
            type="date"
            className="border rounded w-80 p-2 text-gray-700 leading-tight"
            onChange={(e) => setFilterTo(new Date(e.target.value))}
          />
        </label>
      </div>

      <div>
        <Line
          data={{
            labels: data.map((ride) =>
              new Date(ride.date).toLocaleDateString(),
            ),
            datasets: [
              {
                label: `${filterEntryType} graph`,
                data: data.map((ride) => ({
                  x: new Date(ride.date),
                  y: ride.value / 100,
                })),
                borderColor: rideTypeToColor[filterEntryType],
                borderWidth: 2,
                fill: false,
              },
              {
                label: 'Linear regression',
                data: data.map((ride) => ({
                  x: new Date(ride.date),
                  y:
                    linReg.slope * new Date(ride.date).getTime() +
                    linReg.intercept,
                })),
                borderColor: 'orange',
                borderWidth: 2,
                fill: false,
              },
            ],
          }}
        />
        <RidesList rides={data} />
      </div>
    </div>
  );
};
