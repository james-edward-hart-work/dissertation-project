export default function App () {
  const lightMachine = Machine({
    id: 'lightMachine',
    initial: 'green',
    context: {
      updated: 0
    },
    states: {
      green: {
        on: {
          yellow: {
            target: 'yellow',
            actions: 'updatedAction'
          }
        }
      },
      yellow: {
        on: {
          red: {
            target: 'red',
            actions: 'updatedAction'
          }
        }
      },
      red: {
        on: {
          GREEN: {
            target: 'green',
            actions: 'updatedAction'
          }
        }
      }
    }
  });

  const updatedAction = assign({
    updated: (context, event) => context.updated + 1
  });

  const [current, send] = useMachine(lightMachine, {
    actions: { updatedAction }
  });

  return (
    <div>
      <h1>Light traffic</h1>
      <h1>Updated: {current.context.updated} times</h1>
      {current.matches('green') ? (
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "green", marginTop: 10 }} />
      ) : null}
      {current.matches('yellow') ? (
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "yellow", marginTop: 10 }} />
      ) : null}
      {current.matches('red') ? (
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: "red", marginTop: 10 }} />
      ) : null}
      <button disabled={!current.matches('green')} onClick={() => send('YELLOW')}>YELLOW</button>
      <button disabled={!current.matches('yellow')} onClick={() => send('RED')}>RED</button>
      <button disabled={!current.matches('red')} onClick={() => send('GREEN')}>GREEN</button>
    </div>
  );
};

