import type { Heartbeat } from '@/types/monitor';
import { Tab, Tabs } from '@heroui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartTooltip } from '../ui/ChartTooltip';
import { formatLatencyForAxis, getLatencyColor } from '../utils/format';

interface MonitoringChartProps {
  heartbeats: Heartbeat[];
  height?: number;
  showGrid?: boolean;
  color?: 'success' | 'warning' | 'danger' | 'default';
}

const countRanges = [
  { key: '50-points', count: 50 },
  { key: '25-points', count: 25 },
  { key: '10-points', count: 10 },
];

export function MonitoringChart({
  heartbeats,
  height = 200,
  showGrid = false,
  color = 'default',
}: MonitoringChartProps) {
  const t = useTranslations();
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = React.useState(0);

  React.useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  const [selectedRange, setSelectedRange] = React.useState('50-points');

  const filteredData = React.useMemo(() => {
    const count = countRanges.find((r) => r.key === selectedRange)?.count || 100;

    return heartbeats
      .slice(-count)
      .filter((hb) => hb && typeof hb.ping === 'number' && !Number.isNaN(hb.ping))
      .map((hb) => ({
        time: new Date(hb.time).getTime(),
        ping: hb.ping || 0,
        status: hb.status,
        color: getLatencyColor(hb.ping || 0),
      }));
  }, [heartbeats, selectedRange]);

  // Calculate min and max for better Y axis scaling
  const pings = filteredData.map((d) => d.ping).filter((p) => p > 0 && !Number.isNaN(p));
  const minPing = pings.length > 0 ? Math.max(0, Math.min(...pings) - 10) : 0;
  const maxPing = pings.length > 0 ? Math.max(...pings) + 10 : 100;

  const handleRangeChange = (key: React.Key) => {
    setSelectedRange(key as string);
  };

  if (!filteredData.length) {
    return (
      <div className="w-full h-[200px] flex items-center justify-center text-default-500">
        {t('noData')}
      </div>
    );
  }

  return (
    <div className="w-full mt-2">
      <div className="mb-4 mt-3 items-center justify-center flex gap-2">
        <Tabs
          size="sm"
          selectedKey={selectedRange}
          onSelectionChange={handleRangeChange}
          className="font-light text-sm"
        >
          {countRanges.map((range) => (
            <Tab key={range.key} title={t('nodeCount', { count: range.count })} />
          ))}
        </Tabs>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          ref={containerRef}
          key={selectedRange}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          style={{ width: '100%', minHeight: height }}
        >
          {containerWidth > 0 && (
            <AreaChart
              width={containerWidth}
              height={height}
              data={filteredData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
              className="[&_.recharts-surface]:outline-none"
            >
              <defs>
                <linearGradient id={`colorGradient-${color}`} x1="0" x2="0" y1="0" y2="1">
                  <stop
                    offset="10%"
                    stopColor={`hsl(var(--heroui-${color}-500))`}
                    stopOpacity={0.3}
                  />
                  <stop
                    offset="100%"
                    stopColor={`hsl(var(--heroui-${color}-100))`}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              {showGrid && (
                <CartesianGrid
                  stroke="hsl(var(--heroui-default-200))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
              )}
              <XAxis
                dataKey="time"
                type="number"
                scale="time"
                domain={['dataMin', 'dataMax']}
                tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                axisLine={false}
                tickLine={false}
                minTickGap={30}
                interval="preserveStartEnd"
                style={{
                  fontSize: 'var(--heroui-font-size-tiny)',
                }}
              />
              <YAxis
                domain={[minPing, maxPing]}
                hide={!showGrid}
                width={60}
                axisLine={false}
                tickLine={false}
                style={{
                  fontSize: 'var(--heroui-font-size-tiny)',
                }}
                tickFormatter={formatLatencyForAxis}
                dx={-10}
              />
              <Tooltip
                content={<ChartTooltip />}
                cursor={{
                  strokeWidth: 0,
                }}
              />
              <Area
                type="monotone"
                dataKey="ping"
                stroke={`hsl(var(--heroui-${color}))`}
                strokeWidth={2}
                fill={`url(#colorGradient-${color})`}
                animationDuration={1000}
                animationEasing="ease"
                connectNulls
                activeDot={{
                  stroke: `hsl(var(--heroui-${color}))`,
                  strokeWidth: 2,
                  fill: 'hsl(var(--heroui-background))',
                  r: 5,
                }}
                dot={false}
              />
            </AreaChart>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
