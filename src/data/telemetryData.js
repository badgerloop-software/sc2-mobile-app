// Solar Car Telemetry Data Structure
export const telemetryCategories = {
  'Motor & Drive': {
    icon: 'car-sport',
    color: '#C9302C',
    signals: {
      accelerator_pedal: { unit: '%', range: [0, 1], description: 'Accelerator Position' },
      speed: { unit: 'mph', range: [0, 100], description: 'Vehicle Speed' },
      motor_current: { unit: 'A', range: [0, 100], description: 'Motor Current' },
      motor_power: { unit: 'W', range: [0, 100], description: 'Motor Power' },
      motor_temp: { unit: '°C', range: [0, 100], description: 'Motor Temperature' },
      motor_controller_temp: { unit: '°C', range: [0, 100], description: 'Motor Controller Temp' },
      regen_brake: { unit: '%', range: [0, 1], description: 'Regenerative Braking' },
      foot_brake: { unit: '', range: [0, 1], description: 'Foot Brake', type: 'bool' },
      park_brake: { unit: '', range: [0, 1], description: 'Park Brake', type: 'bool' },
    }
  },
  'Battery System': {
    icon: 'battery-charging',
    color: '#C9302C',
    signals: {
      soc: { unit: '%', range: [0, 100], description: 'State of Charge' },
      soh: { unit: '%', range: [0, 100], description: 'State of Health' },
      pack_voltage: { unit: 'V', range: [77.5, 113.15], description: 'Pack Voltage' },
      pack_current: { unit: 'A', range: [-24.4, 48.8], description: 'Pack Current' },
      pack_power: { unit: 'W', range: [-2760.86, 5521.72], description: 'Pack Power' },
      pack_temp: { unit: '°C', range: [0, 55], description: 'Pack Temperature' },
      pack_internal_temp: { unit: '°C', range: [0, 100], description: 'Pack Internal Temp' },
      pack_amphours: { unit: 'Ah', range: [57, 57], description: 'Pack Amp Hours' },
      adaptive_total_capacity: { unit: 'Ah', range: [0, 100], description: 'Total Capacity' },
      fan_speed: { unit: '', range: [0, 6], description: 'Cooling Fan Speed' },
      pack_resistance: { unit: 'mΩ', range: [0, 100], description: 'Pack Resistance' },
      cell_balancing_active: { unit: '', range: [1, 1], description: 'Cell Balancing', type: 'bool' },
    }
  },
  'Solar Array': {
    icon: 'sunny',
    color: '#C9302C',
    signals: {
      mppt_current_out: { unit: 'A', range: [0, 7], description: 'MPPT Output Current' },
      mppt_power_out: { unit: 'W', range: [0, 420], description: 'MPPT Power Output' },
      string1_V_in: { unit: 'V', range: [0, 60], description: 'String 1 Voltage' },
      string2_V_in: { unit: 'V', range: [0, 60], description: 'String 2 Voltage' },
      string3_V_in: { unit: 'V', range: [0, 60], description: 'String 3 Voltage' },
      string1_I_in: { unit: 'A', range: [0, 7], description: 'String 1 Current' },
      string2_I_in: { unit: 'A', range: [0, 7], description: 'String 2 Current' },
      string3_I_in: { unit: 'A', range: [0, 7], description: 'String 3 Current' },
      string1_temp: { unit: '°C', range: [20, 50], description: 'String 1 Temperature' },
      string2_temp: { unit: '°C', range: [20, 50], description: 'String 2 Temperature' },
      string3_temp: { unit: '°C', range: [20, 50], description: 'String 3 Temperature' },
      mppt_mode: { unit: '', range: [0, 1], description: 'MPPT Mode', type: 'bool' },
    }
  },
  'High Voltage': {
    icon: 'flash',
    color: '#C9302C',
    signals: {
      discharge_enabled: { unit: '', range: [0, 0], description: 'Discharge Enabled', type: 'bool' },
      charge_enabled: { unit: '', range: [0, 0], description: 'Charge Enabled', type: 'bool' },
      isolation: { unit: '', range: [0, 0], description: 'HV Isolation', type: 'bool' },
      mppt_contactor: { unit: '', range: [1, 1], description: 'MPPT Contactor', type: 'bool' },
      motor_controller_contactor: { unit: '', range: [1, 1], description: 'MC Contactor', type: 'bool' },
      low_contactor: { unit: '', range: [1, 1], description: 'Low Contactor', type: 'bool' },
      dcdc_current: { unit: 'A', range: [0, 100], description: 'DC-DC Current' },
      dcdc_temp: { unit: '°C', range: [0, 100], description: 'DC-DC Temperature' },
      dcdc_deg: { unit: '', range: [1, 1], description: 'DC-DC Derating', type: 'bool' },
      use_dcdc: { unit: '', range: [0, 0], description: 'Use DC-DC', type: 'bool' },
    }
  },
  'Safety Systems': {
    icon: 'shield-checkmark',
    color: '#C9302C',
    signals: {
      driver_eStop: { unit: '', range: [0, 0], description: 'Driver E-Stop', type: 'bool' },
      external_eStop: { unit: '', range: [0, 0], description: 'External E-Stop', type: 'bool' },
      crash: { unit: '', range: [0, 0], description: 'Crash Detection', type: 'bool' },
      bps_fault: { unit: '', range: [0, 0], description: 'BPS Fault', type: 'bool' },
      voltage_failsafe: { unit: '', range: [0, 0], description: 'Voltage Failsafe', type: 'bool' },
      current_failsafe: { unit: '', range: [0, 0], description: 'Current Failsafe', type: 'bool' },
      relay_failsafe: { unit: '', range: [0, 0], description: 'Relay Failsafe', type: 'bool' },
      charge_interlock_failsafe: { unit: '', range: [0, 0], description: 'Charge Interlock', type: 'bool' },
      internal_hardware_fault: { unit: '', range: [0, 0], description: 'Hardware Fault', type: 'bool' },
      internal_software_fault: { unit: '', range: [0, 0], description: 'Software Fault', type: 'bool' },
    }
  },
  'Environmental': {
    icon: 'thermometer',
    color: '#C9302C',
    signals: {
      air_temp: { unit: '°C', range: [0, 100], description: 'Air Temperature' },
      brake_temp: { unit: '°C', range: [0, 100], description: 'Brake Temperature' },
      road_temp: { unit: '°C', range: [0, 100], description: 'Road Temperature' },
      mainIO_temp: { unit: '°C', range: [0, 100], description: 'Main IO Temperature' },
    }
  },
  'Power Systems': {
    icon: 'power',
    color: '#C9302C',
    signals: {
      main_5V_bus: { unit: 'V', range: [0, 100], description: '5V Bus Voltage' },
      main_12V_bus: { unit: 'V', range: [0, 100], description: '12V Bus Voltage' },
      main_24V_bus: { unit: 'V', range: [0, 100], description: '24V Bus Voltage' },
      main_5V_current: { unit: 'A', range: [0, 100], description: '5V Bus Current' },
      main_12V_current: { unit: 'A', range: [0, 100], description: '12V Bus Current' },
      main_24V_current: { unit: 'A', range: [0, 100], description: '24V Bus Current' },
      supplemental_voltage: { unit: 'V', range: [0, 100], description: 'Supplemental Voltage' },
      supplemental_current: { unit: 'A', range: [0, 100], description: 'Supplemental Current' },
      est_supplemental_soc: { unit: '%', range: [0, 100], description: 'Supplemental SOC' },
      bms_input_voltage: { unit: 'V', range: [12, 24], description: 'BMS Input Voltage' },
    }
  },
  'Vehicle Controls': {
    icon: 'settings',
    color: '#C9302C',
    signals: {
      mcc_state: { unit: '', range: [0, 7], description: 'MCC State' },
      crz_pwr_mode: { unit: '', range: [0, 1], description: 'Cruise Power Mode', type: 'bool' },
      crz_spd_mode: { unit: '', range: [0, 1], description: 'Cruise Speed Mode', type: 'bool' },
      crz_pwr_setpt: { unit: 'W', range: [0, 100], description: 'Cruise Power Setpoint' },
      crz_spd_setpt: { unit: 'mph', range: [0, 100], description: 'Cruise Speed Setpoint' },
      eco: { unit: '', range: [0, 1], description: 'Eco Mode', type: 'bool' },
      l_turn_led_en: { unit: '', range: [0, 1], description: 'Left Turn Signal', type: 'bool' },
      r_turn_led_en: { unit: '', range: [0, 1], description: 'Right Turn Signal', type: 'bool' },
      brake_led_en: { unit: '', range: [0, 1], description: 'Brake Light', type: 'bool' },
      headlights_led_en: { unit: '', range: [0, 1], description: 'Headlights', type: 'bool' },
      hazards: { unit: '', range: [0, 0], description: 'Hazard Lights', type: 'bool' },
    }
  },
  'Navigation': {
    icon: 'navigate',
    color: '#C9302C',
    signals: {
      lat: { unit: '°', range: [43.0700, 43.0760], description: 'Latitude' },
      lon: { unit: '°', range: [-89.4050, -89.3950], description: 'Longitude' },
      elev: { unit: 'm', range: [260, 280], description: 'Elevation' },
    }
  },
  'System Status': {
    icon: 'pulse',
    color: '#C9302C',
    signals: {
      bms_can_heartbeat: { unit: '', range: [1, 1], description: 'BMS CAN Heartbeat', type: 'bool' },
      hv_can_heartbeat: { unit: '', range: [1, 1], description: 'HV CAN Heartbeat', type: 'bool' },
      mainIO_heartbeat: { unit: '', range: [1, 1], description: 'Main IO Heartbeat', type: 'bool' },
      mcc_can_heartbeat: { unit: '', range: [1, 1], description: 'MCC CAN Heartbeat', type: 'bool' },
      mppt_can_heartbeat: { unit: '', range: [1, 1], description: 'MPPT CAN Heartbeat', type: 'bool' },
      fr_telem: { unit: '', range: [0, 1], description: 'Front Telemetry', type: 'bool' },
      main_telem: { unit: '', range: [0, 1], description: 'Main Telemetry', type: 'bool' },
    }
  }
};

// Mock data generator for testing
export const generateMockTelemetryData = () => {
  const data = {};
  
  Object.keys(telemetryCategories).forEach(category => {
    const signals = telemetryCategories[category].signals;
    Object.keys(signals).forEach(signalName => {
      const signal = signals[signalName];
      if (signal.type === 'bool') {
        data[signalName] = Math.random() > 0.5;
      } else {
        const [min, max] = signal.range;
        const value = Math.random() * (max - min) + min;
        // Keep lat/lon as numbers for proper map functionality
        if (signalName === 'lat' || signalName === 'lon') {
          data[signalName] = parseFloat(value.toFixed(6));
        } else {
          data[signalName] = value.toFixed(2);
        }
      }
    });
  });
  
  // Add timestamp
  const now = new Date();
  data.tstamp_unix = now.getTime();
  data.tstamp_hr = now.getHours();
  data.tstamp_mn = now.getMinutes();
  data.tstamp_sc = now.getSeconds();
  data.tstamp_ms = now.getMilliseconds();
  
  return data;
};

// Helper function to get signal display value
export const getSignalDisplayValue = (signalName, value, category) => {
  const signal = telemetryCategories[category]?.signals[signalName];
  if (!signal) return value;
  
  if (signal.type === 'bool') {
    return value ? 'ON' : 'OFF';
  }
  
  return `${value}${signal.unit}`;
};

// Helper function to get signal status (normal, warning, critical)
export const getSignalStatus = (signalName, value, category) => {
  const signal = telemetryCategories[category]?.signals[signalName];
  if (!signal) return 'normal';
  
  if (signal.type === 'bool') {
    // For boolean signals, check if value matches expected range
    const [expectedMin, expectedMax] = signal.range;
    const expectedValue = expectedMin === expectedMax ? expectedMin : null;
    if (expectedValue !== null && value !== expectedValue) {
      return 'warning';
    }
    return 'normal';
  }
  
  const [min, max] = signal.range;
  const numValue = parseFloat(value);
  
  // Critical if outside range
  if (numValue < min || numValue > max) {
    return 'critical';
  }
  
  // Warning if in outer 10% of range
  const range = max - min;
  const warningThreshold = range * 0.1;
  if (numValue < min + warningThreshold || numValue > max - warningThreshold) {
    return 'warning';
  }
  
  return 'normal';
};
